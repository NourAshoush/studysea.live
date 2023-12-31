package uk.ac.bham.teamproject.service;

import java.util.List;
import javax.persistence.criteria.JoinType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;
import uk.ac.bham.teamproject.domain.*; // for static metamodels
import uk.ac.bham.teamproject.domain.Post;
import uk.ac.bham.teamproject.repository.PostRepository;
import uk.ac.bham.teamproject.service.criteria.PostCriteria;

/**
 * Service for executing complex queries for {@link Post} entities in the database.
 * The main input is a {@link PostCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link Post} or a {@link Page} of {@link Post} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class PostQueryService extends QueryService<Post> {

    private final Logger log = LoggerFactory.getLogger(PostQueryService.class);

    private final PostRepository postRepository;

    public PostQueryService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    /**
     * Return a {@link List} of {@link Post} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<Post> findByCriteria(PostCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<Post> specification = createSpecification(criteria);
        return postRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link Post} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<Post> findByCriteria(PostCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Post> specification = createSpecification(criteria);
        return postRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(PostCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<Post> specification = createSpecification(criteria);
        return postRepository.count(specification);
    }

    /**
     * Function to convert {@link PostCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Post> createSpecification(PostCriteria criteria) {
        Specification<Post> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), Post_.id));
            }
            if (criteria.getCreatedBy() != null) {
                specification = specification.and(buildStringSpecification(criteria.getCreatedBy(), Post_.createdBy));
            }
            if (criteria.getCreationTime() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getCreationTime(), Post_.creationTime));
            }
            if (criteria.getTitle() != null) {
                specification = specification.and(buildStringSpecification(criteria.getTitle(), Post_.title));
            }
            if (criteria.getLikes() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getLikes(), Post_.likes));
            }
        }
        return specification;
    }
}
