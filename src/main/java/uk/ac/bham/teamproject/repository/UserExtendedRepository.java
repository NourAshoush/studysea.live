package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.UserExtended;

/**
 * Spring Data JPA repository for the UserExtended entity.
 */
@Repository
public interface UserExtendedRepository extends JpaRepository<UserExtended, Long> {
    default Optional<UserExtended> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<UserExtended> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<UserExtended> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct userExtended from UserExtended userExtended left join fetch userExtended.user",
        countQuery = "select count(distinct userExtended) from UserExtended userExtended"
    )
    Page<UserExtended> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct userExtended from UserExtended userExtended left join fetch userExtended.user")
    List<UserExtended> findAllWithToOneRelationships();

    @Query("select userExtended from UserExtended userExtended left join fetch userExtended.user where userExtended.id =:id")
    Optional<UserExtended> findOneWithToOneRelationships(@Param("id") Long id);

    @Query("select userExtended from UserExtended userExtended left join fetch userExtended.user where userExtended.user.id =:id")
    Optional<UserExtended> findByUserId(@Param("id") Long id);

    @Query(
        "select userExtended from UserExtended userExtended left join userExtended.studySession studySession where studySession.id = :ssId"
    )
    UserExtended findBySessionId(@Param("ssId") Long id);
}
