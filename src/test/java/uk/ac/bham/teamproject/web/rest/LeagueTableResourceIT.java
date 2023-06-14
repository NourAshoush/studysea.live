package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.LeagueTable;
import uk.ac.bham.teamproject.repository.LeagueTableRepository;

/**
 * Integration tests for the {@link LeagueTableResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class LeagueTableResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/league-tables";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LeagueTableRepository leagueTableRepository;

    @Mock
    private LeagueTableRepository leagueTableRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLeagueTableMockMvc;

    private LeagueTable leagueTable;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LeagueTable createEntity(EntityManager em) {
        LeagueTable leagueTable = new LeagueTable().name(DEFAULT_NAME);
        return leagueTable;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LeagueTable createUpdatedEntity(EntityManager em) {
        LeagueTable leagueTable = new LeagueTable().name(UPDATED_NAME);
        return leagueTable;
    }

    @BeforeEach
    public void initTest() {
        leagueTable = createEntity(em);
    }

    @Test
    @Transactional
    void createLeagueTable() throws Exception {
        int databaseSizeBeforeCreate = leagueTableRepository.findAll().size();
        // Create the LeagueTable
        restLeagueTableMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leagueTable)))
            .andExpect(status().isCreated());

        // Validate the LeagueTable in the database
        List<LeagueTable> leagueTableList = leagueTableRepository.findAll();
        assertThat(leagueTableList).hasSize(databaseSizeBeforeCreate + 1);
        LeagueTable testLeagueTable = leagueTableList.get(leagueTableList.size() - 1);
        assertThat(testLeagueTable.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createLeagueTableWithExistingId() throws Exception {
        // Create the LeagueTable with an existing ID
        leagueTable.setId(1L);

        int databaseSizeBeforeCreate = leagueTableRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLeagueTableMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leagueTable)))
            .andExpect(status().isBadRequest());

        // Validate the LeagueTable in the database
        List<LeagueTable> leagueTableList = leagueTableRepository.findAll();
        assertThat(leagueTableList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLeagueTables() throws Exception {
        // Initialize the database
        leagueTableRepository.saveAndFlush(leagueTable);

        // Get all the leagueTableList
        restLeagueTableMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(leagueTable.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllLeagueTablesWithEagerRelationshipsIsEnabled() throws Exception {
        when(leagueTableRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restLeagueTableMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(leagueTableRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllLeagueTablesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(leagueTableRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restLeagueTableMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(leagueTableRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getLeagueTable() throws Exception {
        // Initialize the database
        leagueTableRepository.saveAndFlush(leagueTable);

        // Get the leagueTable
        restLeagueTableMockMvc
            .perform(get(ENTITY_API_URL_ID, leagueTable.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(leagueTable.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingLeagueTable() throws Exception {
        // Get the leagueTable
        restLeagueTableMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLeagueTable() throws Exception {
        // Initialize the database
        leagueTableRepository.saveAndFlush(leagueTable);

        int databaseSizeBeforeUpdate = leagueTableRepository.findAll().size();

        // Update the leagueTable
        LeagueTable updatedLeagueTable = leagueTableRepository.findById(leagueTable.getId()).get();
        // Disconnect from session so that the updates on updatedLeagueTable are not directly saved in db
        em.detach(updatedLeagueTable);
        updatedLeagueTable.name(UPDATED_NAME);

        restLeagueTableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLeagueTable.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLeagueTable))
            )
            .andExpect(status().isOk());

        // Validate the LeagueTable in the database
        List<LeagueTable> leagueTableList = leagueTableRepository.findAll();
        assertThat(leagueTableList).hasSize(databaseSizeBeforeUpdate);
        LeagueTable testLeagueTable = leagueTableList.get(leagueTableList.size() - 1);
        assertThat(testLeagueTable.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingLeagueTable() throws Exception {
        int databaseSizeBeforeUpdate = leagueTableRepository.findAll().size();
        leagueTable.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLeagueTableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, leagueTable.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(leagueTable))
            )
            .andExpect(status().isBadRequest());

        // Validate the LeagueTable in the database
        List<LeagueTable> leagueTableList = leagueTableRepository.findAll();
        assertThat(leagueTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLeagueTable() throws Exception {
        int databaseSizeBeforeUpdate = leagueTableRepository.findAll().size();
        leagueTable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeagueTableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(leagueTable))
            )
            .andExpect(status().isBadRequest());

        // Validate the LeagueTable in the database
        List<LeagueTable> leagueTableList = leagueTableRepository.findAll();
        assertThat(leagueTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLeagueTable() throws Exception {
        int databaseSizeBeforeUpdate = leagueTableRepository.findAll().size();
        leagueTable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeagueTableMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leagueTable)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LeagueTable in the database
        List<LeagueTable> leagueTableList = leagueTableRepository.findAll();
        assertThat(leagueTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLeagueTableWithPatch() throws Exception {
        // Initialize the database
        leagueTableRepository.saveAndFlush(leagueTable);

        int databaseSizeBeforeUpdate = leagueTableRepository.findAll().size();

        // Update the leagueTable using partial update
        LeagueTable partialUpdatedLeagueTable = new LeagueTable();
        partialUpdatedLeagueTable.setId(leagueTable.getId());

        restLeagueTableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLeagueTable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLeagueTable))
            )
            .andExpect(status().isOk());

        // Validate the LeagueTable in the database
        List<LeagueTable> leagueTableList = leagueTableRepository.findAll();
        assertThat(leagueTableList).hasSize(databaseSizeBeforeUpdate);
        LeagueTable testLeagueTable = leagueTableList.get(leagueTableList.size() - 1);
        assertThat(testLeagueTable.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateLeagueTableWithPatch() throws Exception {
        // Initialize the database
        leagueTableRepository.saveAndFlush(leagueTable);

        int databaseSizeBeforeUpdate = leagueTableRepository.findAll().size();

        // Update the leagueTable using partial update
        LeagueTable partialUpdatedLeagueTable = new LeagueTable();
        partialUpdatedLeagueTable.setId(leagueTable.getId());

        partialUpdatedLeagueTable.name(UPDATED_NAME);

        restLeagueTableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLeagueTable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLeagueTable))
            )
            .andExpect(status().isOk());

        // Validate the LeagueTable in the database
        List<LeagueTable> leagueTableList = leagueTableRepository.findAll();
        assertThat(leagueTableList).hasSize(databaseSizeBeforeUpdate);
        LeagueTable testLeagueTable = leagueTableList.get(leagueTableList.size() - 1);
        assertThat(testLeagueTable.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingLeagueTable() throws Exception {
        int databaseSizeBeforeUpdate = leagueTableRepository.findAll().size();
        leagueTable.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLeagueTableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, leagueTable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(leagueTable))
            )
            .andExpect(status().isBadRequest());

        // Validate the LeagueTable in the database
        List<LeagueTable> leagueTableList = leagueTableRepository.findAll();
        assertThat(leagueTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLeagueTable() throws Exception {
        int databaseSizeBeforeUpdate = leagueTableRepository.findAll().size();
        leagueTable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeagueTableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(leagueTable))
            )
            .andExpect(status().isBadRequest());

        // Validate the LeagueTable in the database
        List<LeagueTable> leagueTableList = leagueTableRepository.findAll();
        assertThat(leagueTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLeagueTable() throws Exception {
        int databaseSizeBeforeUpdate = leagueTableRepository.findAll().size();
        leagueTable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeagueTableMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(leagueTable))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LeagueTable in the database
        List<LeagueTable> leagueTableList = leagueTableRepository.findAll();
        assertThat(leagueTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLeagueTable() throws Exception {
        // Initialize the database
        leagueTableRepository.saveAndFlush(leagueTable);

        int databaseSizeBeforeDelete = leagueTableRepository.findAll().size();

        // Delete the leagueTable
        restLeagueTableMockMvc
            .perform(delete(ENTITY_API_URL_ID, leagueTable.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LeagueTable> leagueTableList = leagueTableRepository.findAll();
        assertThat(leagueTableList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
